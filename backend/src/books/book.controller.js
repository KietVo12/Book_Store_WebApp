const Book = require("./book.model");
const elasticClient = require("../../elastic-client");

const postABook = async (req, res) => {
    try {
        const newBook = await Book({...req.body});
        const savedBook = await newBook.save();
        await elasticClient.index({
            index: "books",
            id: savedBook.id,
            document: {
                title: savedBook.title,
                id: savedBook.id
            }
        }
        )
        res.status(200).send({message: "Book posted successfully", book: newBook})
    } catch (error) {
        console.error("Error creating book", error);
        res.status(500).send({message: "Failed to create book"})
    }
}

// get all books
const getAllBooks =  async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1});
        res.status(200).send(books)
        
    } catch (error) {
        console.error("Error fetching books", error);
        res.status(500).send({message: "Failed to fetch books"})
    }
}

const getSingleBook = async (req, res) => {
    try {
        const {id} = req.params;
        const book =  await Book.findById(id);
        if(!book){
            res.status(404).send({message: "Book not Found!"})
        }
        res.status(200).send(book)
        
    } catch (error) {
        console.error("Error fetching book", error);
        res.status(500).send({message: "Failed to fetch book"})
    }

}

// update book data
const UpdateBook = async (req, res) => {
    try {
        const {id} = req.params;
        const updatedBook =  await Book.findByIdAndUpdate(id, req.body, {new: true});
        if(!updatedBook) {
            res.status(404).send({message: "Book is not Found!"})
        }
        res.status(200).send({
            message: "Book updated successfully",
            book: updatedBook
        })
    } catch (error) {
        console.error("Error updating a book", error);
        res.status(500).send({message: "Failed to update a book"})
    }
}

const deleteABook = async (req, res) => {
    try {
        const {id} = req.params;
        const deletedBook =  await Book.findByIdAndDelete(id);

        await elasticClient.delete({
            index: "books",
            id: deletedBook.id
        });
        if(!deletedBook) {
            res.status(404).send({message: "Book is not Found!"})
        }
        res.status(200).send({
            message: "Book deleted successfully",
            book: deletedBook
        })
    } catch (error) {
        console.error("Error deleting a book", error);
        res.status(500).send({message: "Failed to delete a book"})
    }
};

//Search for title
const searchByTitle = async (req, res) => {
    try {
        const {title} = req.query;
        const books = await elasticClient.search({
            index: "books",
            query: {
                match: {
                    title: {
                        query: title,
                        fuzziness: 2
                    }
                }
            }
        });
        console.log(books);
        res.status(200).send(books.hits.hits.map((hit) => hit._source));
    } catch (error) {
        console.error("Error searching for books", error);
        res.status(500).send({message: "Failed to search for books"});
    }
}




module.exports = {
    postABook,
    getAllBooks,
    getSingleBook,
    UpdateBook,
    deleteABook,
    searchByTitle
}